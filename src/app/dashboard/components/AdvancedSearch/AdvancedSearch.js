'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './AdvancedSearch.module.css';
import { 
  MdSearch, 
  MdClose, 
  MdPerson, 
  MdDescription, 
  MdCalendarToday,
  MdMedicalServices,
  MdChevronRight,
  MdOpenInNew,
  MdFavorite,
  MdFavoriteBorder,
  MdShare,
  MdContentCopy,
  MdVisibility,
  MdAccessTime,
  MdTag,
  MdLocalHospital,
  MdInfo
} from 'react-icons/md';

// Données fictives pour la démonstration
const mockData = {
  patients: [
    { 
      id: 'p1', 
      type: 'patients', 
      name: 'Link Hyrule', 
      avatar: '/img/patients/link.jpg',
      age: 19,
      mainPathology: 'Traumatisme post-aventure',
      referringDoctor: 'Dr. Zelda Royale',
      lastVisit: '02/04/2025',
      recentDocs: [
        { id: 'd1', name: 'Bilan sanguin', date: '02/04/2025' },
        { id: 'd2', name: 'Radiographie épaule', date: '28/03/2025' },
        { id: 'd3', name: 'Évaluation physique', date: '15/03/2025' }
      ]
    },
    { 
      id: 'p2', 
      type: 'patients', 
      name: 'Kratos Spartiate', 
      avatar: '/img/patients/kratos.jpg',
      age: 43,
      mainPathology: 'Douleurs musculaires chroniques',
      referringDoctor: 'Dr. Banner Bruce',
      lastVisit: '29/03/2025',
      recentDocs: [
        { id: 'd4', name: 'IRM cervicales', date: '29/03/2025' },
        { id: 'd5', name: 'Bilan physiothérapie', date: '15/03/2025' }
      ]
    },
    { 
      id: 'p3', 
      type: 'patients', 
      name: 'Lara Croft', 
      avatar: '/img/patients/lara.jpg',
      age: 35,
      mainPathology: 'Fractures multiples post-exploration',
      referringDoctor: 'Dr. Tony Tony',
      lastVisit: '20/03/2025',
      recentDocs: [
        { id: 'd6', name: 'Scan thoracique', date: '20/03/2025' },
        { id: 'd7', name: 'Suivi kinésithérapie', date: '10/03/2025' }
      ]
    }
  ],
  documents: [
    {
      id: 'd1',
      type: 'documents',
      name: 'Bilan sanguin - Link',
      documentType: 'Analyse biologique',
      date: '02/04/2025',
      patient: 'Link Hyrule',
      summary: 'Résultats dans les normes, légère carence en fer détectée.',
      tags: ['hématologie', 'routine', 'suivi']
    },
    {
      id: 'd2',
      type: 'documents',
      name: 'Radiographie épaule - Link',
      documentType: 'Imagerie médicale',
      date: '28/03/2025',
      patient: 'Link Hyrule',
      summary: 'Cicatrisation osseuse complète, absence de calcification anormale.',
      tags: ['orthopédie', 'traumatologie', 'suivi']
    },
    {
      id: 'd4',
      type: 'documents',
      name: 'IRM cervicales - Kratos',
      documentType: 'Imagerie médicale',
      date: '29/03/2025',
      patient: 'Kratos Spartiate',
      summary: 'Usure des disques C4-C5 et C5-C6, compression nerveuse modérée.',
      tags: ['neurologie', 'orthopédie', 'urgent']
    }
  ],
  protocols: [
    {
      id: 'pr1',
      type: 'protocols',
      name: 'Rééducation post-traumatique membre supérieur',
      summary: 'Protocole standard en 12 séances pour rééducation complète suite à une fracture ou entorse grave.',
      patients: ['Link Hyrule', 'Lara Croft'],
      createdBy: 'Dr. Tony Tony',
      lastUpdated: '15/02/2025'
    },
    {
      id: 'pr2',
      type: 'protocols',
      name: 'Programme nutrition sportifs haute intensité',
      summary: 'Régime équilibré avec emphase sur les protéines et les minéraux pour athlètes de haut niveau.',
      patients: ['Kratos Spartiate'],
      createdBy: 'Dr. Zeno',
      lastUpdated: '05/03/2025'
    }
  ],
  appointments: [
    {
      id: 'a1',
      type: 'appointments',
      name: 'Consultation suivi - Link',
      patient: 'Link Hyrule',
      date: '15/04/2025',
      time: '14:30',
      duration: 45,
      doctor: 'Dr. Tony Tony',
      location: 'Cabinet principal'
    },
    {
      id: 'a2',
      type: 'appointments',
      name: 'Séance kinésithérapie - Kratos',
      patient: 'Kratos Spartiate',
      date: '12/04/2025',
      time: '10:00',
      duration: 60,
      doctor: 'Dr. Smith',
      location: 'Salle de rééducation'
    },
    {
      id: 'a3',
      type: 'appointments',
      name: 'Bilan post-opératoire - Lara',
      patient: 'Lara Croft',
      date: '18/04/2025',
      time: '11:15',
      duration: 30,
      doctor: 'Dr. Banner Bruce',
      location: 'Aile médicale B'
    }
  ]
};

const AdvancedSearch = ({ placeholder = "Rechercher..." }) => {
  // États
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    patients: [],
    documents: [],
    protocols: [],
    appointments: []
  });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [pinnedItems, setPinnedItems] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Catégories et leurs métadonnées
  const categories = [
    { id: 'patients', label: 'Patients', icon: <MdPerson />, color: '#4285F4' },
    { id: 'documents', label: 'Documents', icon: <MdDescription />, color: '#34A853' },
    { id: 'protocols', label: 'Protocoles', icon: <MdMedicalServices />, color: '#FBBC05' },
    { id: 'appointments', label: 'Rendez-vous', icon: <MdCalendarToday />, color: '#EA4335' }
  ];

  // Recherche dans les données fictives
  const performSearch = async (term) => {
    if (!term || term.length < 2) {
      setSearchResults({
        patients: [],
        documents: [],
        protocols: [],
        appointments: []
      });
      return;
    }

    setIsLoading(true);

    // Simulation d'un délai API
    await new Promise(resolve => setTimeout(resolve, 600));

    const term_lower = term.toLowerCase();
    
    const filteredResults = {
      patients: mockData.patients.filter(p => 
        p.name.toLowerCase().includes(term_lower) || 
        p.mainPathology.toLowerCase().includes(term_lower)
      ),
      documents: mockData.documents.filter(d => 
        d.name.toLowerCase().includes(term_lower) || 
        d.summary.toLowerCase().includes(term_lower) ||
        d.tags.some(t => t.includes(term_lower))
      ),
      protocols: mockData.protocols.filter(p => 
        p.name.toLowerCase().includes(term_lower) || 
        p.summary.toLowerCase().includes(term_lower) ||
        p.patients.some(patient => patient.toLowerCase().includes(term_lower))
      ),
      appointments: mockData.appointments.filter(a => 
        a.name.toLowerCase().includes(term_lower) || 
        a.patient.toLowerCase().includes(term_lower) ||
        a.doctor.toLowerCase().includes(term_lower)
      )
    };

    setSearchResults(filteredResults);
    setIsLoading(false);
  };

  // Gestion du clic à l'extérieur pour fermer les résultats
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Déclenchement de la recherche avec debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query) performSearch(query);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.length >= 2) {
      performSearch(query);
      setShowResults(true);
    }
  };

  // Calcule le nombre total de résultats
  const calculateTotalResults = () => {
    if (!searchResults) return 0;
    
    return Object.values(searchResults).reduce((total, categoryResults) => {
      return total + (categoryResults ? categoryResults.length : 0);
    }, 0);
  };

  // Gérer l'état survolé pour la prévisualisation
  const handleItemHover = (item) => {
    setHoveredItem(item);
  };

  // Gérer les favoris temporaires (pins)
  const togglePinItem = (itemId, itemType) => {
    const itemIdentifier = `${itemType}-${itemId}`;
    
    if (pinnedItems.includes(itemIdentifier)) {
      setPinnedItems(pinnedItems.filter(id => id !== itemIdentifier));
    } else {
      setPinnedItems([...pinnedItems, itemIdentifier]);
    }
  };

  // Ouvrir dans un nouvel onglet flottant
  const openInFloatingTab = (item) => {
    console.log('Ouverture en onglet flottant de:', item);
    // Implémenter l'ouverture en modal flottant
  };

  // Partager avec un autre professionnel
  const shareWithProfessional = (item) => {
    console.log('Partage de:', item);
    // Implémenter la fonctionnalité de partage
  };

  // Générer le contenu de prévisualisation en fonction de l'élément survolé
  const renderPreview = () => {
    if (!hoveredItem) {
      return (
        <div className={styles.emptyPreview}>
          <div className={styles.previewIcon}>
            <MdInfo />
          </div>
          <p>Survolez un élément pour afficher sa prévisualisation</p>
        </div>
      );
    }

    switch (hoveredItem.type) {
      case 'patients':
        return (
          <div className={styles.patientPreview}>
            <div className={styles.previewHeader}>
              <div className={styles.patientAvatar}>
                {hoveredItem.avatar ? (
                  <div className={styles.avatarPlaceholder} style={{background: 'linear-gradient(135deg, #4285F4, #4285F4)'}}>
                    {hoveredItem.name.charAt(0)}
                  </div>
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {hoveredItem.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className={styles.patientInfo}>
                <h3>{hoveredItem.name}</h3>
                <div className={styles.patientAge}>{hoveredItem.age} ans</div>
                <div className={styles.patientPathology}>
                  <MdLocalHospital className={styles.infoIcon} />
                  {hoveredItem.mainPathology}
                </div>
                <div className={styles.patientDoctor}>
                  <MdPerson className={styles.infoIcon} />
                  {hoveredItem.referringDoctor}
                </div>
              </div>
            </div>
            
            <div className={styles.recentDocuments}>
              <h4>Documents récents</h4>
              <ul className={styles.docsList}>
                {hoveredItem.recentDocs && hoveredItem.recentDocs.map(doc => (
                  <li key={doc.id} className={styles.docItem}>
                    <MdDescription className={styles.docIcon} />
                    <span className={styles.docName}>{doc.name}</span>
                    <span className={styles.docDate}>{doc.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
        
      case 'documents':
        return (
          <div className={styles.documentPreview}>
            <div className={styles.previewHeader}>
              <div className={styles.documentIcon}>
                <MdDescription />
              </div>
              <div className={styles.documentInfo}>
                <h3>{hoveredItem.name}</h3>
                <div className={styles.documentType}>
                  <MdInfo className={styles.infoIcon} />
                  {hoveredItem.documentType}
                </div>
                <div className={styles.documentDate}>
                  <MdAccessTime className={styles.infoIcon} />
                  {hoveredItem.date}
                </div>
                <div className={styles.documentPatient}>
                  <MdPerson className={styles.infoIcon} />
                  {hoveredItem.patient}
                </div>
              </div>
            </div>
            
            <div className={styles.documentSummary}>
              <h4>Résumé</h4>
              <p>{hoveredItem.summary}</p>
            </div>
            
            <div className={styles.documentTags}>
              <h4>Tags</h4>
              <div className={styles.tagsList}>
                {hoveredItem.tags && hoveredItem.tags.map(tag => (
                  <span key={tag} className={styles.tag}>
                    <MdTag className={styles.tagIcon} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'protocols':
        return (
          <div className={styles.protocolPreview}>
            <div className={styles.previewHeader}>
              <div className={styles.protocolIcon}>
                <MdMedicalServices />
              </div>
              <div className={styles.protocolInfo}>
                <h3>{hoveredItem.name}</h3>
                <div className={styles.protocolDate}>
                  <MdAccessTime className={styles.infoIcon} />
                  Mise à jour: {hoveredItem.lastUpdated}
                </div>
                <div className={styles.protocolCreator}>
                  <MdPerson className={styles.infoIcon} />
                  {hoveredItem.createdBy}
                </div>
              </div>
            </div>
            
            <div className={styles.protocolSummary}>
              <h4>Résumé</h4>
              <p>{hoveredItem.summary}</p>
            </div>
            
            <div className={styles.protocolPatients}>
              <h4>Patients concernés</h4>
              <ul className={styles.patientsList}>
                {hoveredItem.patients && hoveredItem.patients.map(patient => (
                  <li key={patient} className={styles.protocolPatientItem}>
                    <MdPerson className={styles.patientIcon} />
                    {patient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
        
      case 'appointments':
        return (
          <div className={styles.appointmentPreview}>
            <div className={styles.previewHeader}>
              <div className={styles.appointmentIcon}>
                <MdCalendarToday />
              </div>
              <div className={styles.appointmentInfo}>
                <h3>{hoveredItem.name}</h3>
                <div className={styles.appointmentDateTime}>
                  <MdAccessTime className={styles.infoIcon} />
                  {hoveredItem.date} à {hoveredItem.time} ({hoveredItem.duration} min)
                </div>
                <div className={styles.appointmentPatient}>
                  <MdPerson className={styles.infoIcon} />
                  {hoveredItem.patient}
                </div>
                <div className={styles.appointmentDoctor}>
                  <MdLocalHospital className={styles.infoIcon} />
                  {hoveredItem.doctor}
                </div>
              </div>
            </div>
            
            <div className={styles.appointmentLocation}>
              <h4>Lieu</h4>
              <p>{hoveredItem.location}</p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className={styles.emptyPreview}>
            <p>Aucune prévisualisation disponible</p>
          </div>
        );
    }
  };

  // Gérer les actions rapides
  const renderQuickActions = () => {
    if (!hoveredItem) {
      return (
        <div className={styles.emptyActions}>
          <p>Survolez un élément pour afficher les actions rapides</p>
        </div>
      );
    }

    const isPinned = pinnedItems.includes(`${hoveredItem.type}-${hoveredItem.id}`);
    
    return (
      <div className={styles.quickActions}>
        <h3>Actions rapides</h3>
        
        <div className={styles.actionsList}>
          <button 
            className={styles.actionButton}
            onClick={() => console.log('Ouvrir:', hoveredItem)}
            title="Ouvrir dans l'onglet actif"
          >
            <MdVisibility className={styles.actionIcon} />
            <span>Ouvrir</span>
          </button>
          
          <button 
            className={styles.actionButton}
            onClick={() => openInFloatingTab(hoveredItem)}
            title="Ouvrir dans un nouvel onglet flottant"
          >
            <MdOpenInNew className={styles.actionIcon} />
            <span>Nouvel onglet</span>
          </button>
          
          <button 
            className={`${styles.actionButton} ${isPinned ? styles.actionActive : ''}`}
            onClick={() => togglePinItem(hoveredItem.id, hoveredItem.type)}
            title={isPinned ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {isPinned ? 
              <MdFavorite className={styles.actionIcon} /> : 
              <MdFavoriteBorder className={styles.actionIcon} />
            }
            <span>{isPinned ? "Retiré" : "Favoris"}</span>
          </button>
          
          <button 
            className={styles.actionButton}
            onClick={() => shareWithProfessional(hoveredItem)}
            title="Partager avec un autre professionnel"
          >
            <MdShare className={styles.actionIcon} />
            <span>Partager</span>
          </button>
        </div>
        
        <div className={styles.actionContext}>
          <p className={styles.contextTitle}>Contexte associé</p>
          {hoveredItem.type === 'patients' && (
            <div className={styles.contextLinks}>
              <Link href="#" className={styles.contextLink}>
                <MdDescription className={styles.linkIcon} />
                <span>Documents ({hoveredItem.recentDocs?.length || 0})</span>
              </Link>
              <Link href="#" className={styles.contextLink}>
                <MdCalendarToday className={styles.linkIcon} />
                <span>Rendez-vous à venir</span>
              </Link>
            </div>
          )}
          
          {hoveredItem.type === 'documents' && (
            <div className={styles.contextLinks}>
              <Link href="#" className={styles.contextLink}>
                <MdPerson className={styles.linkIcon} />
                <span>Profil du patient</span>
              </Link>
              <Link href="#" className={styles.contextLink}>
                <MdContentCopy className={styles.linkIcon} />
                <span>Documents similaires</span>
              </Link>
            </div>
          )}
          
          {hoveredItem.type === 'protocols' && (
            <div className={styles.contextLinks}>
              <Link href="#" className={styles.contextLink}>
                <MdMedicalServices className={styles.linkIcon} />
                <span>Protocoles associés</span>
              </Link>
            </div>
          )}
          
          {hoveredItem.type === 'appointments' && (
            <div className={styles.contextLinks}>
              <Link href="#" className={styles.contextLink}>
                <MdPerson className={styles.linkIcon} />
                <span>Profil du patient</span>
              </Link>
              <Link href="#" className={styles.contextLink}>
                <MdCalendarToday className={styles.linkIcon} />
                <span>Agenda du jour</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.advancedSearchContainer} ref={searchRef}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={`${styles.searchInputWrapper} ${isFocused ? styles.focused : ''}`}>
          <MdSearch className={styles.searchIcon} />
          <input
            type="text"
            ref={inputRef}
            className={styles.searchInput}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (query.length >= 2) setShowResults(true);
            }}
            onBlur={() => setIsFocused(false)}
          />
          {query && (
            <button 
              type="button" 
              className={styles.clearButton}
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Effacer la recherche"
            >
              <MdClose />
            </button>
          )}
        </div>
      </form>

      {showResults && (
        <div className={styles.searchResultsDropdown}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Recherche avancée en cours...</p>
            </div>
          ) : calculateTotalResults() > 0 ? (
            <div className={styles.resultsLayout}>
              {/* Colonne 1: Résultats filtrés */}
              <div className={styles.resultsColumn}>
                <div className={styles.columnHeader}>
                  <h3>Résultats ({calculateTotalResults()})</h3>
                </div>
                
                <div className={styles.resultsList}>
                  {categories.map(category => {
                    const categoryResults = searchResults[category.id] || [];
                    if (categoryResults.length === 0) return null;
                    
                    return (
                      <div key={category.id} className={styles.categorySection}>
                        <div className={styles.categoryHeader}>
                          <div className={styles.categoryIcon} style={{ backgroundColor: category.color }}>
                            {category.icon}
                          </div>
                          <h4>{category.label}</h4>
                          <span className={styles.categoryBadge}>
                            {categoryResults.length}
                          </span>
                          <button className={styles.viewAllButton}>
                            Voir tout <MdChevronRight />
                          </button>
                        </div>
                        
                        <div className={styles.categoryResults}>
                          {categoryResults.slice(0, 3).map(item => (
                            <div 
                              key={item.id} 
                              className={`${styles.resultItem} ${hoveredItem?.id === item.id ? styles.activeItem : ''}`}
                              onMouseEnter={() => handleItemHover(item)}
                            >
                              {category.id === 'patients' && (
                                <div className={styles.itemAvatar} style={{background: 'rgba(66, 133, 244, 0.2)'}}>
                                  {item.name.charAt(0)}
                                </div>
                              )}
                              
                              {category.id !== 'patients' && (
                                <div className={styles.itemIcon} style={{ color: category.color }}>
                                  {category.icon}
                                </div>
                              )}
                              
                              <div className={styles.itemContent}>
                                <div className={styles.itemName}>{item.name}</div>
                                
                                {category.id === 'patients' && (
                                  <div className={styles.itemSubtitle}>{item.mainPathology}</div>
                                )}
                                
                                {category.id === 'documents' && (
                                  <div className={styles.itemSubtitle}>{item.date} • {item.documentType}</div>
                                )}
                                
                                {category.id === 'protocols' && (
                                  <div className={styles.itemSubtitle}>{item.patients.length} patients</div>
                                )}
                                
                                {category.id === 'appointments' && (
                                  <div className={styles.itemSubtitle}>{item.date} à {item.time}</div>
                                )}
                              </div>
                              
                              <div className={styles.itemIndicator}></div>
                            </div>
                          ))}
                          
                          {categoryResults.length > 3 && (
                            <div className={styles.moreResults}>
                              + {categoryResults.length - 3} autres résultats
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Colonne 2: Prévisualisation contextuelle */}
              <div className={styles.previewColumn}>
                <div className={styles.columnHeader}>
                  <h3>Aperçu</h3>
                </div>
                
                <div className={styles.previewContent}>
                  {renderPreview()}
                </div>
              </div>

              {/* Colonne 3: Actions rapides */}
              <div className={styles.actionsColumn}>
                <div className={styles.columnHeader}>
                  <h3>Actions</h3>
                </div>
                
                <div className={styles.actionsContent}>
                  {renderQuickActions()}
                </div>
              </div>
            </div>
          ) : (
            query.length >= 2 && (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>
                  <MdSearch />
                </div>
                <p>Aucun résultat trouvé pour "{query}"</p>
                <div className={styles.searchSuggestions}>
                  <p>Suggestions:</p>
                  <ul>
                    <li>Vérifiez l'orthographe des mots-clés</li>
                    <li>Essayez des termes plus généraux</li>
                    <li>Essayez différentes catégories</li>
                  </ul>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
